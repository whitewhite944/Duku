from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.http import JsonResponse, QueryDict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q

from .models import *
from apps.utils import restful
from apps.utils.inception_tool import inception_status,rollback_data
from apps.utils.baseview import *
from apps.utils import wrappers
import re

# Create your views here.


class DBConfView(BaseListView):
    model = DBCONF
    template_name = 'sqlmng/dbconf.html'

    def get_queryset(self):
        queryset = self.model.objects.all()
        return queryset


class InceptionCheckView(BaseListView):
    model = INCEPTIONSQL
    db_model = DBCONF
    template_name = 'sqlmng/inception_check.html'

    def post(self, request, *args, **kwargs):
        data = QueryDict(request.body).dict()
        env = data.get('env')
        db_name = data.get('db_name')
        treater = data.get('treater')
        sql_content = data.get('sql_content')
        remark = data.get('remark')
        object_db = self.db_model.objects.get(name=db_name, env=env)               
        db_conn = '--user=%s;--password=%s;--host=%s;--port=%s;--check=1;' %(object_db.user, object_db.password, object_db.address, object_db.port)
        status, result = inception_status(db_conn, db_name, sql_content)
        error_info = []
        if status == -1:
            return JsonResponse({'status':-2, 'message':result})            
        else: 
            if status == 0:
                for info in result:
                    inception_info = info[4]
                    if inception_info is not None:
                        error_info.append(inception_info)           
        if error_info:
            return JsonResponse({'status':2, 'message':error_info})
        user = request.user          
        data['committer'] = user.username
        treater_name = data.get('treater')
        treater = User.objects.get(username=treater_name)
        object_sql = self.model.objects.create(**data)
        object_sql.sql_users.add(user, treater)
        return JsonResponse({'status':0})

    def get_queryset(self):
        queryset = self.model.objects.all()
        return queryset


class APIEnvView(View):
    model = DBCONF

    def post(self, request, *args, **kwargs):
        data = QueryDict(request.body).dict()
        env = data.get('env')
        ret = dict()
        ret['env'] = [queryset.name for queryset in self.model.objects.filter(env=env)]
        user = request.user
        username = user.username
        if user.is_superuser:
            ret['treaters'] = [username]
            return JsonResponse(ret)
        role = user.role
        if env == '2':
            ret['treaters'] = [username]
        elif env == '1':              
            if role == '3':
                group = user.groups.first()
                if group:
                    group_users = group.user_set.all()
                    ret['treaters'] = [user.username for user in group_users if user.role == '2']
                else:
                    ret['treaters'] = []
            else:
                ret['treaters'] = [username]                                                    
        return JsonResponse(ret)


class InceptionResultView(BaseListView):
    model = INCEPTIONSQL
    db_model = DBCONF
    template_name = 'sqlmng/inception_result.html'

    def get_queryset(self):
        queryset = self.model.objects.all()
        return queryset

    @wrappers.handle_check_permission
    def post(self, request, *args , **kwargs):
        data = QueryDict(request.body).dict()
        pk = data.get('pk')
        action_type = data.get('actiontype')
        object_pk = self.model.objects.get(pk=pk)
        env = object_pk.env
        db_name = object_pk.db_name
        sql_content = object_pk.sql_content
        object_db = self.db_model.objects.get(name=db_name, env=env)
        db_conn = '--user=%s;--password=%s;--host=%s;--port=%s;--execute=1;--backup=1;' %(object_db.user, object_db.password, object_db.address, object_db.port)
        ret = {'status': 0}
        if action_type == 'execute':
            status, result = inception_status(db_conn, db_name, sql_content)
            opid_list = []
            affected_rows = 0
            for info in result:
                inception_info = info[4]
                if inception_info is None:
                    object_pk.status = 0
                    affected_rows += info[6]
                    opid_list.append(info[7])
                    object_pk.rollback_db = info[8]
                else:
                    object_pk.status = 2
                    object_pk.execute_info = info
                    ret['message'] = info
                    ret['status'] = -1
                    break
            object_pk.rollback_id = opid_list
            object_pk.exe_affected_rows = affected_rows
        elif action_type == 'rollback':
            rollback_id = object_pk.rollback_id
            rollback_db = object_pk.rollback_db
            rollback_sqls = ''
            for opid in eval(rollback_id)[1:]:
                rollback_source = 'select tablename from $_$Inception_backup_information$_$ where opid_time = "%s" ' % opid
                rollback_table = rollback_data(rollback_source, rollback_db)[0][0]
                rollback_content = 'select rollback_statement from %s.%s where opid_time = "%s" ' % (rollback_db, rollback_table, opid)
                per_rollback = rollback_data(rollback_content)
                for sqls in per_rollback:
                    rollback_sqls += sqls[0]
            status, result = inception_status(db_conn, db_name, sql_content)
            object_pk.status = -2
            rollback_affected_rows = len(result) - 1
            object_pk.roll_affected_rows = rollback_affected_rows
            ret['status'] = -2
        else:
            object_pk.status = 1
            ret['status'] = 1
        object_pk.save()                
        return JsonResponse(ret)                