from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from .models import Artist

def index(request):
    artist_list = Artist.objects.order_by('rank')
    context = {
        'artist_list': artist_list,
    }
    return render(request, 'artists/index.html', context)

def info(request, artist_id):
    try:
        artist = get_object_or_404(Artist, pk=artist_id)
    except Artist.DoesNotExist:
        raise Http404("Artist does not exist/is not charted.")
    return render(request, 'artists/info.html', {'artist': artist})

def api(request):
    data = serializers.serialize("json", Artist.objects.all())
    return JsonResponse(data, safe=False)
