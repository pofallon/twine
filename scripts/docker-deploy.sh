echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build --build-arg version="$TRAVIS_TAG" -t pofallon/twine:latest .
docker tag pofallon/twine:latest pofallon/twine:$TRAVIS_TAG
docker push "pofallon/twine:latest" && docker push "pofallon/twine:$TRAVIS_TAG"