# Pull the latest Ubuntu image
FROM ubuntu

# Update and install dependencies
RUN apt-get update && apt-get install -y wget iproute2 curl

# Set the working directory
WORKDIR /usr/bin/rlm

# Copy the RLM assets
COPY ./rlmAssets .

# Read in the organization name
ARG ORG

# Copy the licenses for the given organization
COPY ./licenses/$ORG .

# Download the latest version of RLM for linux
RUN wget http://www.reprisesoftware.com/license_admin_kits/x64_l1.admin.tar.gz

# Extract the archive
RUN tar -xf /usr/bin/rlm/x64_l1.admin.tar.gz

# Set full permissions on all files
RUN chmod 777 /usr/bin/rlm

# Set the entrypoint
ENTRYPOINT [ "/bin/bash", "/usr/bin/rlm/entrypoint.sh" ]