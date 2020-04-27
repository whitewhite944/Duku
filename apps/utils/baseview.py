from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView, ListView
from django.http import JsonResponse, QueryDict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q

from apps.cmdb.models import *
from apps.utils import restful,wrappers


class BaseListView(LoginRequiredMixin,ListView):
    model = None
    template_name = None
    template_detail = None
    paginate_by = 10

    def handle_page(self, page, queryset):
        paginator = Paginator(queryset, self.paginate_by)
        try:
            paginator_data = paginator.page(page)
        except PageNotAnInteger:
            paginator_data = paginator.page(1)
        except EmptyPage:
            paginator_data = paginator.page(paginator.num_pages)
        return paginator_data 

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk:
            obj = self.model.objects.get(pk=pk)
            return render(request, self.template_detail, obj.to_dict)  
        search = request.GET.get('search', '')
        queryset = self.get_queryset()
        queryset = [obj.to_dict for obj in queryset]
        page = request.GET.get('page')  
        paginator_data = self.handle_page(page, queryset)
        return render(request, self.template_name, {'paginator_data': paginator_data,'search': search})

    @wrappers.handle_except_data
    def post(self, request, *args, **kwargs):
        data = QueryDict(request.body).dict()
        self.model.objects.create(**data)
        return restful.ok()

    @wrappers.handle_except_data
    def put(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        data = QueryDict(request.body).dict()
        self.model.objects.filter(pk=pk).update(**data)
        return restful.ok()
            
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        self.model.objects.filter(pk=pk).delete()
        return restful.ok()   


class BaseAccountListView(LoginRequiredMixin,ListView):
    model = None
    template_name = None
    template_detail = None
    paginate_by = 10

    def handle_page(self, page, queryset):
        paginator = Paginator(queryset, self.paginate_by)
        try:
            paginator_data = paginator.page(page)
        except PageNotAnInteger:
            paginator_data = paginator.page(1)
        except EmptyPage:
            paginator_data = paginator.page(paginator.num_pages)
        return paginator_data 

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk:
            obj = self.model.objects.get(pk=pk)
            return render(request, self.template_detail, obj.to_dict)  
        search = request.GET.get('search', '')
        queryset = self.get_queryset()
        page = request.GET.get('page')  
        paginator_data = self.handle_page(page, queryset)
        return render(request, self.template_name, {'paginator_data': paginator_data,'search': search})

    @wrappers.handle_except_data
    def post(self, request, *args, **kwargs):
        data = QueryDict(request.body).dict()
        self.model.objects.create(**data)
        return restful.ok()

    @wrappers.handle_except_data
    def put(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        data = QueryDict(request.body).dict()
        self.model.objects.filter(pk=pk).update(**data)
        return restful.ok()
            
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        self.model.objects.filter(pk=pk).delete()
        return restful.ok()  

class BaseApiView(View):
    model = None

    @wrappers.handle_api_permission
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk:
            obj = self.model.objects.get(pk=pk)
            data = obj.to_dict
        else:
            queryset = self.model.objects.all()
            data = {'data': [obj.to_dict for obj in queryset]}
        return JsonResponse(data)               