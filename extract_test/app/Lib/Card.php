<?php

namespace App\Lib;

class Card
{
    public $title;

    public $value;

    public $kv = [];

    public function __construct(string $title, string $value)
    {
        $this->title = $title;
        $this->value = $value;
    }

    public function setKV(array $kv)
    {
        $this->kv = $kv;

        return $this;
    }

    public static function make(string $title, string $value, array $kv)
    {
        return (new self($title, $value))->setKV($kv);
    }
}
