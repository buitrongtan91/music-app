from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, throttle_classes, permission_classes
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.response import Response
from rest_framework import status, parsers
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView, 
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
    UpdateAPIView
)
from .serializers import (
    RegisterSerializer,
    CustomerInfoSerializer,
    ArtistSerializer,
    ArtistDetailSerializer,
    CustomerProfileSerializer
)
from song.serializers import (
    PlayListSerializer, SongSerializerForPlaylistDetail
)
from song.models import (
    Playlist, Song
)
from .models import Artist, Customer
from .permissions import CustomerPermission


class CustomerProfileDetailAV(RetrieveAPIView):
    def get_object(self):
        return self.request.user.customer
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]
    
class CustomerProfileUploadAV(UpdateAPIView):
    def get_object(self):
        return self.request.user.customer
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated, CustomerPermission]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    

class LikedPlaylistListAV(ListAPIView):
    def get_queryset(self):
        return self.request.user.customer.liked_playlists.all()
    serializer_class = PlayListSerializer
    permission_classes = [IsAuthenticated]
    
class LikedSongListAV(ListAPIView):
    def get_queryset(self):
        return self.request.user.customer.liked_songs.all()
    serializer_class = SongSerializerForPlaylistDetail
    permission_classes = [IsAuthenticated]
    
class ArtistListAV(ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]

    
class ArtistDetailAV(RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_context(self):
        return {'request': self.request}
class FollowingArtistListAV(ListAPIView):
    def get_queryset(self):
        return self.request.user.customer.followed_artists.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_artist(request, pk):
    artist = get_object_or_404(Artist, pk=pk)
    request.user.customer.followed_artists.add(artist)
    return Response(status=status.HTTP_202_ACCEPTED)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_artist(request, pk):
    artist = get_object_or_404(Artist, pk=pk)
    request.user.customer.followed_artists.remove(artist)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_song(request, pk):
    song = get_object_or_404(Song, pk=pk)
    request.user.customer.liked_songs.add(song)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlike_song(request, pk):
    song = get_object_or_404(Song, pk=pk)
    request.user.customer.liked_songs.remove(song)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_playlist(request, pk):
    playlist = get_object_or_404(Playlist, pk=pk)
    request.user.customer.liked_playlists.add(playlist)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlike_playlist(request, pk):
    playlist = get_object_or_404(Playlist, pk=pk)
    request.user.customer.liked_playlists.remove(playlist)
    return Response(status=status.HTTP_202_ACCEPTED)

# Create your views here.
@api_view(['POST'])
# @throttle_classes([AnonRateThrottle, UserRateThrottle])
def register_view(request):
    print('register', request.data)
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

@api_view(['POST'])
def login_view(request):
    user_info = request.data.get('user_info')
    password = request.data.get('password')

    if not user_info or not password:
        return Response({'message': 'Missing user_info or password'}, status=status.HTTP_400_BAD_REQUEST)

    if '@' in user_info:
        user = User.objects.filter(email=user_info).first()
    else:
        user = User.objects.filter(username=user_info).first()
    
    if user and user.check_password(password):
        if hasattr(user, 'customer'): 
            serializer = CustomerInfoSerializer(instance=user.customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'message': 'Customer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'message': 'User info or password is incorrect!'}, status=status.HTTP_400_BAD_REQUEST)