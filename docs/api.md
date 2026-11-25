# Vtunel public API (v1)

Lets any app read and manage the events, tasks, templates and routines of a Vtunel user.

## Authentication

1. In Vtunel, open **Developers** in the navigation and create an API key (one per app is a good idea).
2. Copy the key (`vt_...`). It is shown only once; only a hash is stored.
3. Send it in the `X-API-Key` header of every request:

```sh
curl -H "X-API-Key: vt_..." https://your-vtunel-url/api/v1/events
```

A key gives full access to the data of its owner. Revoke it from **Developers** if it leaks or the app is no longer used.

## Endpoints

`{resource}` is one of `events`, `tasks`, `templates`, `routines`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/{resource}` | List. Accepts `?from=` and `?to=` (ISO 8601) for `events`, `tasks` and `routines` |
| GET | `/api/v1/{resource}/{id}` | Get one |
| POST | `/api/v1/{resource}` | Create (JSON body). Responds `201` |
| PATCH | `/api/v1/{resource}/{id}` | Partial update (JSON body) |
| DELETE | `/api/v1/{resource}/{id}` | Delete. Responds `204` |

Dates are ISO 8601 strings (`2026-11-24T10:00:00.000Z`). Every item also has `id`, `created` and `updated`. Unknown fields in the body are ignored.

### Fields

| Resource | Fields (* required on create) |
|---|---|
| `events` | `name`*, `startTime`*, `endTime`*, `allDay`, `recurrenceType` (`none`, `daily`, `weekly`, `monthly`, `yearly`), `recurrenceInterval`, `recurrenceDays`, `recurrenceEnd`, `exceptionDates` |
| `tasks` | `title`*, `startTime`, `endTime`, `allDay`, `done` |
| `templates` | `title`*, `duration` |
| `routines` | `name`*, `weekdays`* (array of numbers), `startTime`*, `endTime`*, `repeatUntil` |

### Date ranges

- `events`: those that overlap the range, plus every recurring event (their occurrences aren't expanded).
- `tasks`: those with dates that overlap the range (tasks without dates are left out).
- `routines`: those that started before `to` and don't end before `from`.

## Errors

Errors use the PocketBase format: `{ "status": 400, "message": "...", "data": {} }`.

| Status | When |
|---|---|
| 400 | Invalid body, missing required fields or bad dates |
| 401 | Missing or invalid `X-API-Key` |
| 404 | Unknown resource, or the item doesn't exist or belongs to another user |

## Examples

```sh
KEY=vt_...
URL=https://your-vtunel-url

# Events of December
curl -H "X-API-Key: $KEY" "$URL/api/v1/events?from=2026-12-01T00:00:00Z&to=2027-01-01T00:00:00Z"

# Create an event
curl -X POST -H "X-API-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"name":"Dentist","startTime":"2026-12-03T09:00:00Z","endTime":"2026-12-03T10:00:00Z"}' \
  "$URL/api/v1/events"

# Mark a task as done
curl -X PATCH -H "X-API-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"done":true}' "$URL/api/v1/tasks/TASK_ID"

# Delete a routine
curl -X DELETE -H "X-API-Key: $KEY" "$URL/api/v1/routines/ROUTINE_ID"
```

## Implementation

The routes are PocketBase hooks in `db/pb_hooks/` (`resources.pb.js`, `api_keys.pb.js`, `utils.js`). Next.js proxies `/api/*` to PocketBase, so they are served from the app URL. To expose another collection, add it to `RESOURCES` in `db/pb_hooks/utils.js`.
