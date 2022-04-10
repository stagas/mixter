import type { Ctor } from './types'

export function mixter<
  A extends Ctor,
  B extends Ctor,
  C extends Ctor,
  D extends Ctor,
  E extends Ctor,
  F extends Ctor,
  G extends Ctor,
  H extends Ctor,
  I extends Ctor,
  J extends Ctor,
  K extends Ctor,
>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
  f: (trait: E) => F,
  g: (trait: F) => G,
  h: (trait: G) => H,
  i: (trait: H) => I,
  j: (trait: I) => J,
  k: (trait: J) => K,
): A & B & C & D & E & F & G & H & I & J & K

export function mixter<
  A extends Ctor,
  B extends Ctor,
  C extends Ctor,
  D extends Ctor,
  E extends Ctor,
  F extends Ctor,
  G extends Ctor,
  H extends Ctor,
  I extends Ctor,
  J extends Ctor,
>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
  f: (trait: E) => F,
  g: (trait: F) => G,
  h: (trait: G) => H,
  i: (trait: H) => I,
  j: (trait: I) => J,
): A & B & C & D & E & F & G & H & I & J

export function mixter<
  A extends Ctor,
  B extends Ctor,
  C extends Ctor,
  D extends Ctor,
  E extends Ctor,
  F extends Ctor,
  G extends Ctor,
  H extends Ctor,
  I extends Ctor,
>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
  f: (trait: E) => F,
  g: (trait: F) => G,
  h: (trait: G) => H,
  i: (trait: H) => I,
): A & B & C & D & E & F & G & H & I

export function mixter<
  A extends Ctor,
  B extends Ctor,
  C extends Ctor,
  D extends Ctor,
  E extends Ctor,
  F extends Ctor,
  G extends Ctor,
  H extends Ctor,
>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
  f: (trait: E) => F,
  g: (trait: F) => G,
  h: (trait: G) => H,
): A & B & C & D & E & F & G & H

export function mixter<
  A extends Ctor,
  B extends Ctor,
  C extends Ctor,
  D extends Ctor,
  E extends Ctor,
  F extends Ctor,
  G extends Ctor,
>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
  f: (trait: E) => F,
  g: (trait: F) => G,
): A & B & C & D & E & F & G

export function mixter<
  A extends Ctor,
  B extends Ctor,
  C extends Ctor,
  D extends Ctor,
  E extends Ctor,
  F extends Ctor,
>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
  f: (trait: E) => F,
): A & B & C & D & E & F

export function mixter<A extends Ctor, B extends Ctor, C extends Ctor, D extends Ctor, E extends Ctor>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
  e: (trait: D) => E,
): A & B & C & D & E

export function mixter<A extends Ctor, B extends Ctor, C extends Ctor, D extends Ctor>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
  d: (trait: C) => D,
): A & B & C & D

export function mixter<A extends Ctor, B extends Ctor, C extends Ctor>(
  a: A,
  b: (trait: A) => B,
  c: (trait: B) => C,
): A & B & C

export function mixter<A extends Ctor, B extends Ctor>(
  a: A,
  b: (trait: A) => B,
): A & B

export function mixter<A extends Ctor>(
  a: A,
  ...mixins: ((trait: any) => any)[]
) {
  return mixins.reduce((c, mixin) => mixin(c), a)
}
