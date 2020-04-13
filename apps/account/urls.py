from django.urls import path,re_path,include

from .views import *

app_name = 'account'

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('logout/',LogoutView.as_view(),name='logout'),
    re_path('user/(?P<pk>\d+)?/?$',UserView.as_view(),name='user'),
    re_path('group/(?P<pk>\d+)?/?$',GroupView.as_view(),name='group'),
    re_path('api_group/(?P<pk>\d+)?/?$',APIGroupView.as_view(),name='api_group'),
]