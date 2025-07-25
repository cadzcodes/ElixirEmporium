<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'address_id',
        'payment_method',
        'subtotal',
        'shipping_fee',
        'total',
        'status',
        'order_date',
        'eta',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'eta' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    
}
