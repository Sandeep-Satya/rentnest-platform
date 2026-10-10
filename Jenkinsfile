pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Sandeep-Satya/rentnest-platform.git'
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

        stage('Frontend Dependency Security Scan') {
            steps {
                dir('client') {
                    sh '''
                        npm audit --audit-level=high || true
                    '''
                }
            }
        }

        stage('Backend Dependency Security Scan') {
            steps {
                dir('server') {
                    sh '''
                        npm audit --audit-level=high || true
                    '''
                }
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
                sh '''
                    cd server
                    npm install
                    npm run build
                '''
            }
        }
    }

    post {
        success {
            echo 'RentNest security scans and frontend/backend builds completed.'
        }
        failure {
            echo 'Build failed. Check the stage logs.'
        }
    }
}
