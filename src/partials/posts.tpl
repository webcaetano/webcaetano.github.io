<h1> Posts </h1>


<div class="posts-grid">
	<%
	_.each(posts,function(post)){
		print(`<div class="post-cell">
			<div class="thumb">${post.thumb}</div>
			<div class="title">${post.title}</div>
		</div>`)
	}
	%>
</div>
