
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Node.js and npm') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('server') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'RentNest frontend and backend builds completed successfully.'
        }
        failure {
            echo 'Build failed. Check the stage logs.'
        }
    }
}
