def get_changed_data( instance, validated_data):
        changed_data = {}
        for attr, value in validated_data.items():
            old_value = getattr(instance, attr)
            if old_value != value:
                changed_data[attr] = (old_value, value)
        return changed_data