#!/bin/bash

uwsgi --socket 0.0.0.0:5000 --protocol=http -p 3 -w wsgi:app