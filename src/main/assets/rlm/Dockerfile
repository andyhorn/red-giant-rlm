FROM ubuntu

RUN apt-get update && apt-get install -y wget iproute2 curl

WORKDIR /usr/bin/rlm

COPY ./rlmAssets .

ARG ORG

COPY ./licenses/$ORG .

RUN wget http://www.reprisesoftware.com/license_admin_kits/x64_l1.admin.tar.gz

RUN tar -xf /usr/bin/rlm/x64_l1.admin.tar.gz

ENTRYPOINT [ "/bin/bash", "/usr/bin/rlm/entrypoint.sh" ]