# tables existing in the sqlite DB

CREATE TABLE tbl_repo_master (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type   STRING,
    actor_ref_id INTEGER REFERENCES tbl_actor (id),
    public       BOOLEAN,
    created_at   STRING
);


CREATE TABLE tbl_repo_details (
    Id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    created_date       STRING,
    repo_master_ref_id INTEGER REFERENCES tbl_repo_details (Id),
    event_ref_id       INTEGER REFERENCES tbl_event (id),
    name               STRING,
    url                STRING
);


CREATE TABLE tbl_event (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        STRING,
    description STRING
);


CREATE TABLE tbl_actor (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    login         STRING,
    display_login STRING,
    gravatar_id   STRING,
    url           STRING,
    avatar_url    STRING
);
