module DashboardHelper
  def find_current_order
    if current_user.role == 'rider'
      order = Order.where(rider_id: current_user.id).last
    elsif current_user.role == 'driver'
      order = Order.where(driver_id: current_user.id).sort_by(&:updated_at).last
    else #admin
      return nil
    end
    if (order != nil) && (order.status != "completed")
      order
    else
      nil
    end
  end

  def rating
    reviews = Review.where(driver_id: @profile.user.id, owner: 'rider')
    count_rating(reviews)
  end

  def user_rating
    reviews = Review.where(driver_id: current_user.id, owner: 'rider')
    count_rating(reviews)
  end

  def count_rating(reviews)
    if reviews.length != 0
      rating = 0
      reviews.each { |rev| rating += rev.stars.to_i }
      rating /= reviews.length
    end
    rating
  end
end
