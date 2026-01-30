# Restoring the Writing Page

The writing page was removed in commit `eefc01a`. To restore it:

## 1. Restore the files from git history

```bash
# Restore the writing page and blog post
git checkout eefc01a~1 -- src/pages/writing.astro src/pages/writing/writing-promise.mdx
```

## 2. Add the navigation link back

In `src/components/Navigation.astro`, add the writing link between films and information:

```astro
<li><a href="/photographs" class:list={["nav-link", { active: currentPath === '/photographs/' }]}>photographs</a></li>
<li><a href="/films" class:list={["nav-link", { active: currentPath === '/films/' }]}>films</a></li>
<li><a href="/writing" class:list={["nav-link", { active: currentPath === '/writing/' }]}>writing</a></li>
<li><a href="/information" class:list={["nav-link", { active: currentPath === '/information/' }]}>information</a></li>
```

## 3. Commit the restoration

```bash
git add src/pages/writing.astro src/pages/writing/ src/components/Navigation.astro
git commit -m "Restore writing page"
```
