from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Resume, Section, Style

# Register custom User model with UserAdmin
admin.site.register(User, UserAdmin)

class SectionInline(admin.TabularInline):
    model = Section
    extra = 1

class StyleInline(admin.TabularInline):
    model = Style
    extra = 1

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'template_name', 'created_at', 'updated_at')
    list_filter = ('template_name', 'created_at')
    search_fields = ('title', 'user__username')
    inlines = [StyleInline, SectionInline]

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('type', 'resume', 'order')
    list_filter = ('type',)
    search_fields = ('resume__title', 'resume__user__username')

@admin.register(Style)
class StyleAdmin(admin.ModelAdmin):
    list_display = ('resume', 'primary_color', 'font_family', 'font_size')
    search_fields = ('resume__title', 'resume__user__username')
