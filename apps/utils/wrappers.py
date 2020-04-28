from apps.utils import restful
from functools import wraps
from django.http import QueryDict, JsonResponse
from django.http import Http404
from apps.sqlmng.models import *

perm_map = {
    'execute': {
        'status': [-1],
        'env': {
            1: ['admin', '1', '2'],
            2: ['admin', '1', '2', '3']
        }
    },
    'rollback': {
        'status': [0],
        'env': {
            1: ['admin', '1', '2'],
            2: ['admin', '1', '2', '3']
        }
    },
    'canceled': {
        'status': [-1],
        'env': {
            1: ['admin', '1', '2'],
            2: ['admin', '1', '2', '3']
        }
    }
}

def handle_except_data(func):
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as e:
            if e.args[0] == 1062:
                return restful.params_error(message='对象已存在!')                      
    return wrapper

def handle_check_permission(func):
    def wrapper(self, *args, **kwargs):
        user = self.request.user
        data = QueryDict(self.request.body).dict()
        pk = data.get('pk')
        action_type = data.get('actiontype')
        object_pk = INCEPTIONSQL.objects.get(pk=pk)
        env = object_pk.env
        status = object_pk.status
        role = 'admin' if user.is_superuser else user.role
        perm = perm_map[action_type]
        if status in perm['status'] and role in perm['env'][env]:
            return func(self, *args, **kwargs)
        else:
            return JsonResponse({'status':403, 'message':'无此操作权限!'})           
    return wrapper

def control_permission(func):
    def wrapper(self, *args, **kwargs):
        user = self.request.user
        if user.is_superuser:
            return func(self, *args, **kwargs)
        else:
            raise Http404()
    return wrapper

def handle_api_permission(func):
    def wrapper(self, *args, **kwargs):
        user = self.request.user
        if user.is_superuser and user.is_authenticated:
            return func(self, *args, **kwargs)
        else:
            raise Http404()            
    return wrapper        


