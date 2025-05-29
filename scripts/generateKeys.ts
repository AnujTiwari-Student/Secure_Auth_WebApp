import { exportJWK, generateKeyPair } from 'jose'
import fs from 'fs'

async function generateKeys() {
  const { publicKey, privateKey } = await generateKeyPair('RS256',{
    extractable: true,
  })

  const privateJwk = await exportJWK(privateKey)
  const publicJwk = await exportJWK(publicKey)

  const envAppend = `
    # JWT Keys
    JWT_PRIVATE_KEY='${JSON.stringify(privateJwk)}'
    JWT_PUBLIC_KEY='${JSON.stringify(publicJwk)}'
    `

    fs.appendFileSync('.env', envAppend)
        console.log('✅ JWT keys appended to .env')
    }

generateKeys()
    .catch((error) => {
        console.error('Error generating keys:', error)
    })