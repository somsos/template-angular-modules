pipeline {

  agent any

  stages {

      stage('1. build') {
        steps {
            sh 'bash ./build.sh'
        }
      }

/*
Note: --rm flag on docker run is necessary so when the container is stopped, is also removed, so when
next deploy is run there will not be conflicts.

Note2: Keep the sh ''' ... ''' parts by separate, because if not, it seems
that by keeping the commands in the same 'sh' block the order is not respected.
*/
      stage('2. deploy') {
        steps {
            sh 'bash deploy.sh'
        }
      }

  }

}
