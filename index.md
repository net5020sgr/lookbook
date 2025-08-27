---
layout: default
title: "My Lookbook"
---

# 👗 My Lookbook

<div class="gallery">
  {% for post in site.posts %}
  <div class="photo-card">
    <a href="{{ post.url }}">
      <img src="{{ post.image }}" alt="{{ post.title }}">
      <p>{{ post.title }}</p>
      <small>{{ post.date | date: "%Y-%m-%d" }}</small><br>
      <small>Tags: {{ post.tags | join: ", " }}</small>
    </a>
  </div>
  {% endfor %}
</div>

<style>
.gallery { display: flex; flex-wrap: wrap; gap: 15px; }
.photo-card { width: 200px; text-align: center; }
.photo-card img { width: 100%; border-radius: 10px; }
</style>
