<div class="menu">
	<%
	_.each([
		{
			link:'/#about',
			name:'About'
		},
		{
			link:'/#portofolio',
			name:'Portfolio'
		},
		{
			link:'mailto:webandrecaetano@gmail.com',
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
