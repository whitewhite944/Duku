from django import forms
from django.core.cache import cache
from django.contrib.auth import get_user_model

from apps.utils.forms import FormMixin
from .models import User

User = get_user_model()

class LoginForm(forms.Form,FormMixin):
    username = forms.CharField(max_length=20)
    password = forms.CharField(min_length=6,max_length=20,error_messages={"max_length":"密码最多不能超过20个字符!","min_length":"密码最多不能小于6个字符!"})
    remember = forms.IntegerField(required=False)
    
class RegisterForm(forms.Form,FormMixin):
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(min_length=6,max_length=20,error_messages={"max_length":"密码最多不能超过20个字符!","min_length":"密码最多不能小于6个字符!"})
    password2 = forms.CharField(min_length=6,max_length=20,error_messages={"max_length":"密码最多不能超过20个字符!","min_length":"密码最多不能小于6个字符!"})
    email = forms.EmailField(required=True)
    
    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        username = cleaned_data.get('username')
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError("两次密码输入不一致!")

        exists = User.objects.filter(username=username).exists()
        if exists:
            raise forms.ValidationError("该用户已被注册~")
        return cleaned_data
