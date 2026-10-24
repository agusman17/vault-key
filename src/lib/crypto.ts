import { AES, enc, SHA256 } from 'crypto-js'
import type { RecoveryKey } from '@/types'

const PBKDF2_ITERATIONS = 100_000
const KEY_BITS = 256
// Crockford Base32 alphabet (excludes ambiguous chars: 0, 1, I, L, O, U)
const ALPHABET = '023456789ABCDEFGHJKLMNPQRSTVWXYZ'

/**
 * Derive a 256-bit vault key from a master password using PBKDF2-SHA256
 * (100,000 iterations) via the Web Crypto API. Returns a hex string.
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: string,
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: PBKDF2_ITERATIONS,
      salt: new TextEncoder().encode(salt),
    },
    keyMaterial,
    KEY_BITS,
  )

  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * AES-256 encrypt a plaintext string with a hex-encoded vault key (CryptoJS).
 */
export function encryptPassword(plain: string, vaultKey: string): string {
  return AES.encrypt(plain, enc.Hex.parse(vaultKey)).toString()
}

/**
 * AES-256 decrypt a ciphertext string with a hex-encoded vault key (CryptoJS).
 */
export function decryptPassword(cipher: string, vaultKey: string): string {
  const decrypted = AES.decrypt(cipher, enc.Hex.parse(vaultKey))
  return decrypted.toString(enc.Utf8)
}

/**
 * SHA-256 hex digest of an input string.
 */
export function sha256Hex(input: string): string {
  return SHA256(input).toString(enc.Hex)
}

/**
 * Generate a one-time recovery key (20 bytes = 160 bits = 32 Crockford Base32 chars).
 */
export function generateRecoveryKey(): RecoveryKey {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  return base32Encode(bytes) as RecoveryKey
}

/**
 * Normalize a recovery key: uppercase, strip dashes and spaces.
 */
export function normalizeRecoveryKey(input: string): string {
  return input.replace(/[-|\s]/g, '').toUpperCase()
}

/**
 * SHA-256 hash of a normalized recovery key.
 */
export function hashRecoveryKey(key: string): string {
  return sha256Hex(normalizeRecoveryKey(key))
}

/**
 * Derive a decryption key from a recovery key (used to decrypt a vault key
 * wrapped with the recovery key).
 */
export function deriveVaultKeyFromRecovery(recoveryKey: string): string {
  return hashRecoveryKey(recoveryKey)
}

function base32Encode(bytes: Uint8Array): string {
  let bits = 0
  let bitCount = 0
  let result = ''

  for (const byte of bytes) {
    bits = (bits << 8) | byte
    bitCount += 8
    while (bitCount >= 5) {
      bitCount -= 5
      result += ALPHABET[(bits >> bitCount) & 31]
    }
  }

  if (bitCount > 0) {
    result += ALPHABET[(bits << (5 - bitCount)) & 31]
  }

  return result
}
