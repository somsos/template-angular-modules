pipeline {

  agent any

  stages {

      stage('1. build') {
        steps {
            echo '######### build starts ######### ';
            sh '''
              docker build -t template_frontend:1 .
            '''
            echo '######### build ends ######### ';
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
            echo '######### stopping last instance if it is running ######### ';
            sh '''
              docker ps -a --format="table {{.Names}}" | grep template_frontend 1> /dev/null && echo "Stopping template_frontend" && docker stop template_frontend &> /dev/null || true;
            ''';
            sleep(5);
            echo '######### deploy starts ######### ';
            sh '''
              docker run --rm -d --name template_frontend \
                --network template-network \
                --ip 173.100.1.103 -p 4200:80 \
                template_frontend:1;
            ''';
            echo '######### deploy ends ######### ';
        }
      }

  }

}
