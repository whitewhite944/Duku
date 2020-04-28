"""duku URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path,include
from django.conf import settings
from django.views.static import serve

from apps.account.views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include("apps.account.urls")),
    path('cmdb/', include("apps.cmdb.urls")),
    path('sqlmng/', include("apps.sqlmng.urls")),
    path('', LoginView.as_view(), name='login'),
    re_path('media/(?P<path>.*)$', serve,{"document_root":settings.MEDIA_ROOT}),
    re_path('static/(?P<path>.*)$', serve,{"document_root":settings.STATIC_ROOT}),
]

handler404 = 'apps.account.views.page_not_found'
handler500 = 'apps.account.views.page_error'