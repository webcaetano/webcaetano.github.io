<div class="post-cover"><img src="<%=data.cover%>"></div>

<div class="post-header">
	<div class="date"><i class="fa fa-calendar"></i> <%=data.date%></div>
	<div class="author"><i class="fa fa-user"></i> @<%=data.author%></div>
	<div class="tags"><i class="fa fa-tag"></i><span class="tags-head">Tags</span>
		<%
		_.each(data.tags,function(tag){
			print(`<div class="tag">${tag}</div>`);
		});
		%>
	</div>
</div>
