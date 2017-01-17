<div class="menu cl-effect-3">
	<%
	_.each([
		{
			link:'/posts/about',
			name:'About'
		},
		{
			link:'/portfolio-posts',
			name:'Portfolio'
		},
		{
			link:'/contact',
			name:'Contact'
		},
	],function(val){
		print(`
			<div class="menu-tab">
			<a href="${val.link}">
			${val.name}
			</a>

			</div>
		`);
	});
	%>
</div>
