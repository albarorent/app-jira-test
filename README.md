## Evidencia de uso de cherry-pick

Se aplicó cherry-pick del commit realizado originalmente en la rama `feature/tickets-detalle-y-notificaciones` hacia `develop`, para la funcionalidad de comentarios:

```bash
git cherry-pick e5e1d99
```

_Resultado en el historial, verificado con:_
```bash
git log --oneline --graph --all
```
Output:
```
* af28b67 (HEAD -> develop, origin/develop) feat(ui): agregar comentarios en detalle de tareas
*   b3a487e Merge pull request #1 from albarorent/feature/tickets-detalle-y-notificaciones
|\  
| * 016c7d4 (origin/feature/tickets-detalle-y-notificaciones, feature/tickets-detalle-y-notificaciones) feat(notifications): implementar notificaciones y mencionar las alertas @
| * e5e1d99 feat(ui): agregar comentarios en detalle de tareas
| * ...
|/  
* 2460159 (master) chore: initial commit from cloned project
```
Nota cómo el commit de mensaje `"feat(ui): agregar comentarios en detalle de tareas"` aparece con hashes distintos en ambas ramas, producto del cherry-pick.
