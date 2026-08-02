import os

# 1. Rename files
os.rename("index.html", "app.html")
os.rename("landing.html", "index.html")

# 2. Update links in new index.html (formerly landing.html)
with open("index.html", "r") as f:
    content = f.read()

content = content.replace('href="index.html#admin"', 'href="app.html#admin"')
content = content.replace('href="index.html#invite-', 'href="app.html#invite-')

with open("index.html", "w") as f:
    f.write(content)

# 3. Update links generated in js/components/admin.js
with open("js/components/admin.js", "r") as f:
    admin_js = f.read()

# Replace `${baseOrigin}/#invite-${activeEvent.id}` with `${baseOrigin}/app.html#invite-${activeEvent.id}`
admin_js = admin_js.replace("`${baseOrigin}/#invite-${activeEvent.id}`", "`${baseOrigin}/app.html#invite-${activeEvent.id}`")
admin_js = admin_js.replace("`${baseOrigin}/#tracker-${activeEvent.id}`", "`${baseOrigin}/app.html#tracker-${activeEvent.id}`")

with open("js/components/admin.js", "w") as f:
    f.write(admin_js)

print("Route fix completed.")
