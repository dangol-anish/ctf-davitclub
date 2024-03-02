create database ctf_davitclub;

create table users(
    user_id int primary key auto_increment,
    user_name varchar(255) not null,
    user_email varchar(255) not null,
    user_password varchar(255) not null

);