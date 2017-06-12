package io.trydent

import org.jooby.run

fun main(args: Array<String>) {
  run(*args) {
    assets("/", "dist/index.html")
  }
}