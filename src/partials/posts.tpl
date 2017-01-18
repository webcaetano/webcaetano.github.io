<h1> Portofolio </h1>


<div class="posts-grid" align="center">
	<%
	_.each(posts,function(post){
		print(`<a href="/portfolio-posts/${urlEncode(post.title)}">
			<div class="post-cell">
				<div class="post-inside">
					<div class="thumb"><img src="${post.thumb}"></div>
					<div class="title">${post.title}</div>
				</div>
			</div>
		</a>
		`)
	});
	%>
</div>
