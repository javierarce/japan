<div class="Header">
  <h3><%= name %></h3>
</div>
<div class="Body">
  <div class="Message js-message">
    <div class="Spinner"></div>
    <div class="Success">
      <div class="SuccessMessage">
        <strong><%- thanks %></strong>
      </div>
    </div>
  </div>
  <div class="Comment">
    <img class="Avatar" src="<%= profile_image_url %>" />
    <%= comment %>
  </div>
  <textarea class="js-comment" placeholder="<%= placeholder %>" name="name" rows="8" cols="40"><%= comment %></textarea>
  <div class="Controls">
    <% if (logged_in) { %>
    <button class="Button is-red js-add-place">Add this place</button>
    <% } else { %>
    <a href="/login" class="Button Button-login">Login with Twitter</a>
    <button class="Button Button-anon js-add-place">Add anonymously</button>
    <% } %>
  </div>
</div>
<div class="Footer"><%= address %></div>
