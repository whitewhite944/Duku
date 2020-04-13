from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView, ListView
from django.http import JsonResponse, QueryDict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q

from .models import *
from apps.utils import restful
from apps.utils.baseview import *
import json

# Create your views here.


class DashboardView(LoginRequiredMixin,TemplateView):
    template_name = 'cmdb/index.html'

    def get(self, request, *args, **kwargs):
        idc_list = IDC.objects.all()
        rack_list = RACK.objects.all()
        server_list = SERVER.objects.all()
        offline_list = SERVER.objects.filter(status=0)

        context = {
            'idc_list': idc_list.count(),
            'rack_list': rack_list.count(),
            'server_list': server_list.count(),
            'offline_list': offline_list.count()
        }
        return render(request, 'cmdb/index.html', context)



class IdcView(BaseListView):
    model = IDC
    template_name = 'cmdb/idc.html'
    template_detail = 'cmdb/idc_detail.html'

    def get_queryset(self):
        search = self.request.GET.get('search')
        queryset = self.model.objects.all()
        if search:
            queryset = queryset.filter(Q(address__icontains=search) | Q(name__icontains=search)) 
        return queryset


class RackView(BaseListView):
    model = RACK
    template_name = "cmdb/rack.html"
    template_detail = 'cmdb/rack_detail.html'

    def get_queryset(self):
        idc_id = self.request.GET.get('idc_id')
        search = self.request.GET.get('search')
        queryset = self.model.objects.all() 
        if idc_id:
            queryset = queryset.filter(idc_id=idc_id) 
        if search:
            queryset = queryset.filter(Q(number__icontains=search) | Q(name__icontains=search))
        return queryset


class ServerView(BaseListView):
    model = SERVER
    template_name = "cmdb/server.html"
    template_detail = 'cmdb/server_detail.html'

    def get_queryset(self):
        queryset = self.model.objects.all()   
        search = self.request.GET.get('search')   
        if search:
            queryset = queryset.filter(Q(ip__icontains=search) | Q(name__icontains=search))    
        return queryset


class APIIdcsView(BaseApiView):
    model = IDC


class APIRacksView(BaseApiView):
    model = RACK

class APIServersView(BaseApiView):
    model = SERVER

    def post(self, request, *args, **kwargs):
        data = QueryDict(request.body).dict()
        name = data.get('hostname')
        uuid = data.get('uuid')
        server_type = data.get('server_type')
        cpu = data.get('server_cpu')
        ip = json.loads(data.get('ip_info'))
        memory = data.get('server_mem')
        disk = data.get('server_disk')
        daq = json.dumps(data)
        server_data = {
            'name': name,
            'cpu': cpu,
            'ip':ip[0]['ip'],
            'memory': memory,
            'disk': disk,
            'uuid': uuid,
            'server_type': server_type,
            'daq': daq
        }
        queryset = self.model.objects.filter(uuid=uuid, server_type=server_type)
        if queryset:
            queryset.update(**server_data)
            queryset.first().save()
        else:
            self.model.objects.create(**server_data)
        return JsonResponse({})


class APIDashboardView(View):
    def get(self, request, *args, **kwargs):
        idc_list = IDC.objects.all()
        rack_list = RACK.objects.all()
        server_list = SERVER.objects.all()
        data = {}
        data_donut_name = []
        data_donut_data = []
        data_site = []
        for idc in idc_list:
            servers = 0
            site_idc = {}
            racks = idc.rack_set.all()
            total_site = racks.count() * 10
            for rack in racks:
                servers += rack.server_set.all().count()
            site_idc['name'] = idc.name
            site_idc['total_site'] = total_site                          
            site_idc['site'] = servers
            data_site.append(site_idc)  
            data_donut_name.append(idc.name)
            data_donut_data.append(servers)    
        data['data_site'] = data_site
        data['data_donut_name'] = data_donut_name
        data['data_donut_data'] = data_donut_data    
        return JsonResponse(data)