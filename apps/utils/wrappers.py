from apps.utils import restful
from functools import wraps
from django.http import QueryDict, JsonResponse
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
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
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
        if status in perm and role in perm['env'][env]:
            return func(self, *args, **kwargs)
        else:
            return JsonResponse({'status':403, 'message':'无此操作权限!'})           
    return wrapper

def handle_save_data(func):
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as e:
            code = e.args[0]
            if code == 1062:
                status = -1
                message = e.args[1]
            else:
                status = -2
                message = e.args[0]
            return JsonResponse({'status': status, 'message': message})
    return wrapper