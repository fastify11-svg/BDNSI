<script>
    function calculateGPA(mark){
        switch (true) {
            case mark >= 80:
                return 'A+';
            case mark >= 70:
                return 'A';
            case mark >= 60:
                return 'A-';
            case mark >= 50:
                return 'B';
            case mark >= 40:
                return 'C';
            case mark >= 0:
                return 'F';
            default:
                return '';
        }
    }



    function calculateCGPA(mark){
        switch (true) {
            case mark >= 80:
                return 5 +'.00';
            case mark >= 70:
                return 4 +'.70';
            case mark >= 60:
                return 4+'.50';
            case mark >= 50:
                return 3+'.50';
            case mark >= 40:
                return 3+'.00';
            case mark >= 0:
                return 'F';
            default:
                return '';
        }
    }
    function calculateCGPAResult(mark){
        switch (true) {
            case mark >= 80:
                return 'A+';
            case mark >= 70:
                return 'A';
            case mark >= 60:
                return 'A-';
            case mark >= 50:
                return 'B';
            case mark >= 40:
                return 'C';
            case mark >= 1:
                return 'F';
            default:
                return 'Not Found';
        }
    }


</script>
