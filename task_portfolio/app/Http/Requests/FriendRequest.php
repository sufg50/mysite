<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FriendRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [

        
            // })
            // //すでに相手に友達申請を送っているとき。
            // 'my_user_id' => Rule::unique('my_friend_user_ids')->where(function ($query) {
            //     return $query->where('my_friend_user_id', $this->input('to_user_id'));
            // })
            
        ];
    }
}
