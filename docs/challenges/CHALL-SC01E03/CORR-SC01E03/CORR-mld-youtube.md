Pour simplifier le reste du document, on considère que toutes les tables possèdent un champs :
- created_at
- updated_at



playlist (
	id
	title
	description
	is_public
	user_id         #FK->user.id
)

video (
	id
	title
	description
	media_url
	thumbnail_url
	author_id      #FK->user.id
)

user (
	id
	username
	email
	password
	avatar_url
	bio
)

search (
	id
	query
	date
	user_id
)


tag (
	id
	name
)

comment (
	id
	content
	video_id             #FK->video.id
	author_id            #FK->user.id
	parent_comment_id?   #FK->comment.id
)


--- Tables de liaisons ---

video_playlist (
	video_id        #FK->video.id
	playlist_id     #FK->playlist.id
)

subscription (
	follower_id     #FK->user.id   PKC
	followed_id     #FK->user.id   PKC
)

video_tag (
	video_id        #FK->video.id
	tag_id          #FK->tag.id
)

view (
	id
	video_id    #FK->video.id
	viewer_id   #FK->user.id
)

like (
	video_id    #FK->video.id
	viewer_id   #FK->user.id
)

