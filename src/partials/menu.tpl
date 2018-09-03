<div class="menu">
	<%
	_.each([
		{
			link:'/#about',
			name:'About'
		},
		{
			link:'/#portfolio',
			name:'Portfolio'
		},
		{
			link:'/#contact',
			name:'Contact'
		},
	],function(val){
		print(`
			<div class="menu-tab">
				<a href="${val.link}">
					<div class="menu-tab-inside">
						${val.name}
					</div>
				</a>
			</div>
		`);
	});
	%>
</div>
