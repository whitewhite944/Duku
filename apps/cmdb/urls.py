from django.urls import path,re_path,include

from django.urls import base

from .views import *

app_name = 'cmdb'

urlpatterns = [
    path('index/',DashboardView.as_view(),name='index'),
    re_path('idc/(?P<pk>\d+)?/?$',IdcView.as_view(),name='idc'),
    re_path('rack/(?P<pk>\d+)?/?$',RackView.as_view(),name='rack'),
    re_path('server/(?P<pk>\d+)?/?$',ServerView.as_view(),name='server'),
    re_path('api_idcs/(?P<pk>\d+)?/?$',APIIdcsView.as_view(),name='api_idcs'),
    re_path('api_racks/(?P<pk>\d+)?/?$',APIRacksView.as_view(),name='api_racks'),
    re_path('api_servers/(?P<pk>\d+)?/?$',APIServersView.as_view(),name='api_servers'),
    path('api_dashboard/',APIDashboardView.as_view(),name='api_dashboard')
]