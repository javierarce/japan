<div class="Body">
  <div class="comment">
    <a class="js-avatar" href="http://twitter.com/<%= screen_name %>">
      <img class="Avatar" src="<%= profile_image_url %>" />
    </a>
    <p><% if (name) { %><strong><%= name %></strong>: <% } %><%= comment %></p>
  </div>
</div>
<div class="Footer"><%= description %></div>
