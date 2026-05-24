# Përdorim Node.js si bazë
FROM node:20-alpine

# Krijojmë folderin e punës
WORKDIR /app

# Kopjojmë skedarët e paketave
COPY package*.json ./

# Instalojmë varësitë (duke përfshirë devDependencies për build-in e NestJS)
RUN npm install

# Kopjojmë skemën e Prisma-s që të gjenerohet klienti saktë
COPY prisma ./prisma/

# Gjenerojmë Prisma Client
RUN npx prisma generate

# Kopjojmë të gjithë kodin e mbetur të backend-it
COPY . .

# Ndërtojmë kodin e NestJS (nga TS në JS brenda folderit /dist)
RUN npm run build

# Ekspozojmë portën (ndryshoje nëse NestJS punon në portë tjetër, p.sh. 3000)
EXPOSE 5000

# Nisim serverin duke përdorur kodin e ndërtuar
CMD ["node", "dist/src/main.js"]