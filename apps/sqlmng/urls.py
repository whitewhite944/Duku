from django.urls import path,re_path,include

from .views import *

app_name = 'sqlmng'

urlpatterns = [
    re_path('dbconf/(?P<pk>\d+)?/?$',DBConfView.as_view(),name='dbconf'),
    path('inception_check/',InceptionCheckView.as_view(),name='inception_check'),
    re_path('inception_result/(?P<pk>\d+)?/?$',InceptionResultView.as_view(),name='inception_result'),
    re_path('optimize_check/(?P<pk>\d+)?/?$',OptimizeCheckView.as_view(),name='optimize_check'),
    path('api_env/',APIEnvView.as_view(),name='api_env'),
]