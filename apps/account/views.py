from django.shortcuts import render
from django.views import View
from django.contrib.auth.views import LoginView
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate,login,logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.models import Group

from .forms import LoginForm,RegisterForm
from apps.utils import restful
from .models import User
from apps.utils import wrappers
from apps.utils.baseview import *
# Create your views here.


class LoginView(View):
    def get(self,request,*args,**kwargs):
        return render(request,'account/login.html')
    def post(self,request,*args,**kwargs):
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            username = login_form.cleaned_data.get('username')
            password = login_form.cleaned_data.get('password')
            remember = login_form.cleaned_data.get('remember')
            user = authenticate(username=username,password=password)
            if user:
                if user.is_active:
                    login(request,user)
                    if remember:
                        request.session.set_expiry(0)
                    return restful.ok()
                else:
                    return restful.unauth(message="您的账户已被冻结!")
            else:
                return restful.params_error(message="用户名或密码错误")
        else:
            return restful.params_error(message=login_form.get_errors())

    
class RegisterView(View):
    def get(self,request,*args,**kwargs):
        return render(request,'account/register.html')
    def post(self,request,*args,**kwargs):
        register_form = RegisterForm(request.POST)
        if register_form.is_valid():
            username = register_form.cleaned_data.get('username')
            email = register_form.cleaned_data.get('email')
            password1 = register_form.cleaned_data.get('password1')
            password2 = register_form.cleaned_data.get('password2')
            user = User()
            user.username = username
            user.email = email
            user.is_staff = True
            user.password = make_password(password2)
            user.save()
            return restful.ok()
        else:
            return restful.params_error(message=register_form.get_errors())


class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse("login"))   


class UserView(BaseListView):

    model = User
    template_name = 'account/user.html'

    def get_queryset(self):
        queryset = self.model.objects.all()
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(username__contains=search)
        return queryset

    @wrappers.handle_save_data
    def post(self, request, *args, **kwargs):
        data = QueryDict(request.body).dict()
        password = data.get('password')
        group_name = data.pop('group_name')
        user = self.model.objects.create(**data)
        user.set_password(password)
        user.save()
        group_qs = Group.objects.filter(name=group_name)
        if group_qs:
            user.groups.add(group_qs[0])
        return JsonResponse({'status': 1})

    @wrappers.handle_save_data
    def put(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        data = QueryDict(request.body).dict()
        password = data.pop('password')
        group_name = data.pop('group_name')
        user_qs = self.model.objects.filter(pk=pk)
        user_qs.update(**data)
        user = user_qs[0]
        old_password = user.password
        if password != old_password:
            user.set_password(password)
            user.save()
        group_qs = Group.objects.filter(name=group_name)
        if group_qs:
            user.groups.set([group_qs[0]])
        return JsonResponse({'status': 1})


class GroupView(BaseListView):

    model = Group
    template_name = 'account/group.html'

    def get_queryset(self):
        queryset = self.model.objects.order_by('-id')
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(name__contains=search)
        return queryset


class APIGroupView(BaseApiView):

    model = Group

    def get_queryset(self):
        queryset = [i for i in self.model.objects.values('id', 'name')]
        return queryset

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk:
            try:
                instance = self.model.objects.get(pk=pk)
                users = [{'id': user.id, 'username':user.username} for user in instance.user_set.all()]
                data = {
                    'id': instance.id,
                    'name': instance.name,
                    'users':users
                }
            except Exception as e:
                data = e.args[0]
            return JsonResponse({'data': data})
        queryset = self.get_queryset()
        return JsonResponse({'count':len(queryset), 'data': queryset})