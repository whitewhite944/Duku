from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group

# Create your models here.


class User(AbstractUser):
    ROLES = (
        ('1', u'总监'),
        ('2', u'经理'),
        ('3', u'研发'),
    )
    birthday = models.DateField(verbose_name=u"生日", null=True, blank=True)
    gender = models.CharField(max_length=6, choices=(("male",u"男"),("female","女")), default="male")
    image = models.ImageField(upload_to="image/%Y/%m",default=u"image/default.png", max_length=100)
    role = models.CharField(max_length=32, default='3', choices=ROLES)
    remark = models.CharField(max_length=128, default='', blank=True)

    class Meta:
        db_table = 'users'
        verbose_name = "用户表"
        verbose_name_plural = verbose_name
        verbose_name_plural = u'用户'
        ordering = ['-id']

    def __str__(self):
        return self.username

    @property
    def to_dict(self):
        ret = dict()
        for attr in [f.name for f in self._meta.fields]:
            value = getattr(self, attr)
            ret[attr] = value
        group = self.groups.first()
        ret['group'] = group.name if group else ''
        return ret    
          