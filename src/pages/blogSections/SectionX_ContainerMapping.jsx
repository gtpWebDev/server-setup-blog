{
  /* <Step
        n="4"
        title="Mount points you’ll use in docker-compose"
        what="Map services to their on-disk homes."
        why="Ensures data durability and clear boundaries."
        cmd={`# Example fragments for an app's docker-compose.yml

# Postgres
volumes:
  - /srv/data/$APP/postgres/data:/var/lib/postgresql/data
  - /srv/data/$APP/postgres/init:/docker-entrypoint-initdb.d
  - /srv/data/$APP/postgres/conf:/etc/postgresql-custom:ro
  - /srv/logs/$APP/postgres:/var/log/postgresql

# Redis (optional)
volumes:
  - /srv/data/$APP/redis/data:/data
  - /srv/data/$APP/redis/conf:/usr/local/etc/redis:ro
  - /srv/logs/$APP/redis:/var/log/redis

# Mongo (only for that app)
volumes:
  - /srv/data/$APP/mongo/data:/data/db
  - /srv/data/$APP/mongo/conf:/etc/mongo:ro
  - /srv/logs/$APP/mongo:/var/log/mongodb

# Backend / Frontend / Workers
env_file:
  - /srv/secrets/$APP/app.env        # root-owned, mounted by Docker
volumes:
  - /srv/data/$APP/uploads:/app/uploads
  - /srv/logs/$APP/backend:/var/log/app`}
        expect={`Compose services can start with durable mounts and env injection.`}
      /> */
}
