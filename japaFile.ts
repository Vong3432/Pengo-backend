import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import execa from 'execa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

// Add this method to the file
function getTestFiles() {
    let userDefined = process.argv.slice(2)[0]
    if (!userDefined) {
        return 'test/**/*.spec.ts'
    }

    return `${userDefined.replace(/\.ts$|\.js$/, '')}.ts`
}

async function runMigrations() {
    await execa.node('ace', ['migration:run'], {
        stdio: 'inherit',
    })
}

async function rollbackMigrations() {
    await execa.node('ace', ['migration:rollback'], {
        stdio: 'inherit',
    })
}

async function runSeeder() {
    await execa.node('ace', ['db:seed'], {
        stdio: 'inherit',
    })
}

async function startHttpServer() {
    const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
    process.env.PORT = String(await getPort())
    await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configure test runner
 */
configure({
    files: getTestFiles(),
    before: [
        // runMigrations,
        // runSeeder,
        startHttpServer
    ],
    after: [rollbackMigrations]
})
