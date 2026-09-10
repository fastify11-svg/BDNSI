<?php
echo app()->environment(['local', 'testing']) ? 'true' : 'false';
