# Saved version with Piercing Corner

Branch: `archive/main-with-piercing-corner`

This snapshot preserves the November 17, 2026 pricing updates and both Furniture Odyssey and Piercing Corner case studies. Main shows only Furniture Odyssey.

When the user requests the saved version with Piercing Corner, use this branch. Save any uncommitted work before switching:

```sh
git fetch origin
git switch archive/main-with-piercing-corner
```

If the branch is only available on the remote:

```sh
git switch --track origin/archive/main-with-piercing-corner
```

Return to the current main version with `git switch main`. The archive is a fixed snapshot; it does not receive later main changes. To restore only Piercing Corner on a newer main, port the case-study content and matching verification changes instead of replacing main with the snapshot.
