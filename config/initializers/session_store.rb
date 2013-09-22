# Be sure to restart your server when you modify this file.

Shredhub::Application.config.session_store :cookie_store, key: '_Shredhub_session'
Shredhub::Application.config.secret_token = '1e92f6088a282423e387133cc84752ec62488fd86d5f17b616c7570a7265ec428f71ebac676fa7aeae72a70378f3154b9f95cadc6a71e632df9e8ab4c0a1a5b8'

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# Shredhub::Application.config.session_store :active_record_store
